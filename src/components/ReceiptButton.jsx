"use client";

import jsPDF from "jspdf";

export default function ReceiptButton({ order }) {
    const formatDate = (date) =>
        new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const downloadReceipt = () => {
        const receiptWidth = 80; // Standard 80mm thermal receipt width
        const left = 5;
        const right = receiptWidth - 5;

        // Payment lookup mapper
        const paymentMethod = {
            cod: "Cash on Delivery",
            bkash: "bKash",
            nagad: "Nagad",
            rocket: "Rocket",
            bank: "Bank Transfer",
            intl_send: "bKash Send Money"
        };

        // --- PHASE 1: EXACT DYNAMIC HEIGHT CALCULATION ---
        // We simulate the rendering layout process exactly to calculate the true final Y position
        let calcY = 8;

        const measureCenter = () => { calcY += 6; };
        const measureLine = () => { calcY += 4; };
        const measureRow = () => { calcY += 5; };

        // Header simulation
        calcY += 20;
        measureCenter(); // Order Receipt
        measureLine();

        // Meta simulation
        measureRow(); // Tracking
        measureRow(); // Order Date
        measureRow(); // Print Date
        measureLine();

        // Customer simulation
        calcY += 5; // Section title
        measureRow(); // Name
        measureRow(); // Phone
        measureRow(); // District
        calcY += 4; // Address label

        // Dynamic address wrapping calculation
        const testDoc = new jsPDF();
        testDoc.setFontSize(9);
        const addressLines = testDoc.splitTextToSize(order.customer.deliveryAddress || "", 70);
        calcY += (addressLines.length * 4) + 8;
        measureLine();

        // Items simulation
        measureRow(); // Total Items
        calcY += 6; // ITEMS section title
        measureLine();

        order.cartItems.forEach((item) => {
            const name = item.name.includes("|") ? item.name.split("|")[1].trim() : item.name;
            const itemTitleLines = testDoc.splitTextToSize(`• ${name}`, 55);
            calcY += (itemTitleLines.length * 4) + 5; // Name blocks
            calcY += 7; // Quantity + Price line
        });
        measureLine();

        // Payment simulation
        calcY += 6; // PAYMENT section title
        measureRow(); // Method
        measureRow(); // Subtotal
        measureRow(); // Delivery
        measureRow(); // Paid
        measureLine();
        measureRow(); // TOTAL DUE

        // Note simulation
        if (order.customer.specialInstructions) {
            measureLine();
            calcY += 5; // NOTE title
            const noteLines = testDoc.splitTextToSize(order.customer.specialInstructions, 70);
            calcY += (noteLines.length * 4) + 10;
        }

        // Footer simulation
        measureCenter(); // THANK YOU
        measureCenter(); // Web

        // Final Document Target Height (adds an 8mm bottom safety padding margin)
        const finalReceiptHeight = calcY + 2;

        // --- PHASE 2: ACTUAL RECEIPT RENDERING ---
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [receiptWidth, finalReceiptHeight],
        });

        let y = 8;

        const center = (text, size = 12) => {
            doc.setFontSize(size);
            const w = doc.getTextWidth(text);
            doc.text(text, (receiptWidth - w) / 2, y);
            y += 6;
        };

        const line = () => {
            doc.setDrawColor(180);
            doc.line(left, y, right, y);
            y += 4;
        };

        const row = (label, value, isBold = false) => {
            doc.setFontSize(9);
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            doc.text(label, left, y);
            doc.text(String(value), right, y, { align: "right" });
            y += 5;
        };

        // Header Section
        const logo = new Image();
        logo.src = "/logo2.png";

        logo.onload = () => {
            // Center the logo
            doc.addImage(logo, "PNG", 25, y - 3, 30, 18);

            y += 20;

            center("Order Receipt", 11);
            line();
            // center("Order Receipt", 11);

            // Order Meta
            row("Tracking", order.trackingId);
            row("Date", formatDate(order.createdAt)); // Fixed line placement
            row("Printed", formatDate(new Date()));
            line();

            // Customer Section
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("CUSTOMER", left, y);
            doc.setFont("helvetica", "normal");
            y += 5;

            row("Name", order.customer.fullName);
            row("Phone", order.customer.phoneNumber);
            row(
                "Location",
                `${order.customer.thana}, ${order.customer.district}`
            );

            doc.setFontSize(9);
            doc.text("Address:", left, y);
            y += 4;

            const realAddressLines = doc.splitTextToSize(order.customer.deliveryAddress || "", 70);
            doc.text(realAddressLines, left, y);
            y += (realAddressLines.length * 4) + 8;
            line();

            // Items Section
            row("Total Items", String(order.cartItems.length));

            order.cartItems.forEach((item, index) => {
                const name = item.name.includes("|") ? item.name.split("|")[1].trim() : item.name;
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");

                const itemTitleLines = doc.splitTextToSize(`${index + 1}. ${name}`, 55);
                doc.text(itemTitleLines, left, y);
                y += (itemTitleLines.length * 4) + 5;

                doc.text(`Qty: ${item.quantity} x ${item.variant.quantity} KG`, left + 2, y);
                doc.text(`Tk ${item.variant.offerPrice || item.variant.price}`, right, y, { align: "right" });
                y += 7;
            });

            // Payment Details Section
            line();
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("PAYMENT", left, y);
            y += 6;

            row("Method", paymentMethod[order.payment.method] || order.payment.method);
            row("Subtotal", `Tk ${order.payment.actualAmount}`);
            row("Paid", `Tk ${order.payment.amountPaid}`);
            line();

            row("TOTAL DUE", `Tk ${order.payment.amountDue}`, true);

            // Special Instructions
            if (order.customer.specialInstructions) {
                line();
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                doc.text("NOTE", left, y);
                y += 5;

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                const realNoteLines = doc.splitTextToSize(order.customer.specialInstructions, 70);
                doc.text(realNoteLines, left, y);
                y += (realNoteLines.length * 4) + 10;
            }

            // Footer Section
            line();
            center("Thank you for shopping with us!", 10);
            center("www.mangomartbd.shop", 9);

            doc.save(`Receipt-${order.trackingId}.pdf`);
        };
    };

    return (
        <button
            onClick={downloadReceipt}
            className="btn btn-sm md:btn-md bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
            Download Receipt
        </button>
    );
}