import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import AdminNavbar from "@/components/AdminNavbar";
import { Suspense } from "react";

export default async function AdminLayout({ children }) {
    const session = await auth();

    if (!session) {
        redirect("/admin/login");
    }

    const adminCollection = await dbConnect(collectionNameObj.adminCollection);

    const admin = await adminCollection.findOne({
        email: session.user.email,
    });

    if (!admin || admin.role !== "admin") {
        redirect("/admin/login");
    }
    return (
        <AdminNavbar session={session}>
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </AdminNavbar>
    );
}