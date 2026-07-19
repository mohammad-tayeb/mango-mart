const downloadA4Invoice = () => {
    const docA = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const left = 15;
    const right = 195;

    // Payment lookup mapper
    const paymentMethod = {
        cod: "Cash on Delivery",
        bkash: "bKash",
        nagad: "Nagad",
        rocket: "Rocket",
        bank: "Bank Transfer",
        intl_send: "bKash Send Money"
    };

    let y = 20;

    const center = (text, size = 12) => {
        docA.setFontSize(size);
        docA.text(text, 105, y, {
            align: "center",
        });
        y += 6;
    };

    const line = () => {
        docA.setDrawColor(180);
        docA.line(left, y, right, y);
        y += 4;
    };

    const row = (label, value, isBold = false) => {
        docA.setFontSize(9);
        docA.setFont("helvetica", isBold ? "bold" : "normal");
        docA.text(label, left, y);
        docA.text(String(value), right, y, { align: "right" });
        y += 5;
    };

    // Header Section
    const logo = new Image();
    logo.src = "/logo2.png";

    logo.onload = () => {
        // Center the logo
        docA.addImage(logo, "PNG", 90, y - 3, 30, 18);

        y += 20;

        center("MANGO MART BD", 12);

        docA.setFontSize(8);
        docA.text("Fresh Mangoes Delivered Across Bangladesh", 150, y, {
            align: "center",
        });
        y += 4;

        center("INVOICE", 10);
        line();

        // Order Meta
        row("Invoice No", `INV-${order.trackingId}`);
        row("Tracking ID", order.trackingId);
        row("Order Date", formatDate(order.createdAt));
        row("Print Date", formatDate(new Date()));
        line();

        // Customer Section
        docA.setFontSize(10);
        docA.setFont("helvetica", "bold");
        docA.text("BILL TO", left, y);
        docA.setFont("helvetica", "normal");
        y += 5;

        row("Name", order.customer.fullName);
        row("Phone", order.customer.phoneNumber);
        row(
            "Location",
            `${order.customer.thana}, ${order.customer.district}`
        );

        docA.setFontSize(9);
        docA.text("Address:", left, y);
        y += 4;

        const realAddressLines = docA.splitTextToSize(
            order.customer.deliveryAddress || "",
            170
        );
        docA.text(realAddressLines, left, y);
        y += (realAddressLines.length * 4) + 8;
        line();

        // Items Section
        row("Total Items", String(order.cartItems.length));
        line();

        docA.setFont("helvetica", "bold");
        docA.setFontSize(9);

        docA.text("ITEM", left, y);
        docA.text("AMOUNT", right, y, {
            align: "right",
        });
        docA.text("PRICE", right, y, { align: "right" });

        y += 5;

        line();

        docA.setFont("helvetica", "normal");

        order.cartItems.forEach((item, index) => {
            const name = item.name.includes("|") ? item.name.split("|")[1].trim() : item.name;
            docA.setFontSize(9);
            docA.setFont("helvetica", "normal");

            const itemTitleLines = docA.splitTextToSize(
                `${index + 1}. ${name}`,
                150
            );
            docA.text(itemTitleLines, left, y);
            y += (itemTitleLines.length * 4) + 5;

            docA.text(
                `${item.quantity} × ${item.variant.quantity}kg`,
                left + 2,
                y
            );

            docA.text(
                `৳${item.variant.offerPrice || item.variant.price}`,
                right,
                y,
                { align: "right" }
            );
            y += 7;
        });

        // Payment Details Section
        line();
        docA.setFontSize(10);
        docA.setFont("helvetica", "bold");
        docA.text("PAYMENT", left, y);
        y += 6;

        row("Method", paymentMethod[order.payment.method] || order.payment.method);
        line();

        row("Subtotal", `৳${order.payment.actualAmount}`);

        row("Advance Paid", `৳${order.payment.amountPaid}`);

        row("Balance", `৳${order.payment.amountDue}`, true);

        // Special Instructions
        if (order.customer.specialInstructions) {
            line();
            docA.setFontSize(10);
            docA.setFont("helvetica", "bold");
            docA.text("NOTE", left, y);
            y += 5;

            docA.setFontSize(9);
            docA.setFont("helvetica", "normal");
            const realNoteLines = docA.splitTextToSize(
                order.customer.specialInstructions,
                170
            );
            docA.text(realNoteLines, left, y);
            y += (realNoteLines.length * 4) + 10;
        }

        // Footer Section
        line();
        center("Thank You!", 11);

        docA.setFontSize(8);

        docA.text(
            "Keep this invoice for future reference.",
            150,
            y,
            {
                align: "center",
            }
        );

        y += 4;

        docA.text(
            "www.mangomartbd.shop",
            150,
            y,
            {
                align: "center",
            }
        );

        docA.save(`Receipt-${order.trackingId}.pdf`);
    };
};