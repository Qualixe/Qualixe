import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './dashboard.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Dashboard - Qualixe",
  description: "Qualixe Shopify theme development dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Toaster position="top-right" />
      {children}
    </ProtectedRoute>
  );
}
