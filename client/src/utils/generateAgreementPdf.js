// client/src/utils/generateAgreementPdf.js
import jsPDF from "jspdf";

/**
 * Client-side PDF generation (no API).
 * Creates a simple rental agreement PDF for the selected booking.
 */
export function generateAgreementPdf({ booking, customer }) {
  const doc = new jsPDF();

  const margin = 14;
  let y = 14;

  const line = (text, size = 11, bold = false, gap = 6) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, margin, y);
    y += lines.length * gap;
  };

  const hr = () => {
    doc.setDrawColor(220);
    doc.line(margin, y, 196, y);
    y += 8;
  };

  // Header
  doc.setFillColor(26, 35, 126); // #1A237E
  doc.rect(0, 0, 210, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("DRIVEFLOW — Rental Agreement", margin, 12);

  doc.setTextColor(0, 0, 0);
  y = 28;

  const today = new Date().toLocaleDateString();
  const pickup = new Date(booking.pickupDate).toLocaleString();
  const dropoff = new Date(booking.returnDate).toLocaleString();

  line(`Agreement Date: ${today}`, 11, false);
  line(`Agreement ID: DF-AGR-${String(booking.id).padStart(6, "0")}`, 11, false);
  hr();

  // Parties
  line("1) Parties", 12, true);
  line(`Customer: ${customer.lastName} (Reservation Holder)`, 11);
  line(`Reservation Number: ${booking.reservationNumber}`, 11);
  line(`Pickup Location: ${booking.pickupLocation}`, 11);
  line(`Drop-off Location: ${booking.returnLocation}`, 11);
  line(`Pickup Date/Time: ${pickup}`, 11);
  line(`Drop-off Date/Time: ${dropoff}`, 11);
  hr();

  // Vehicle
  line("2) Vehicle", 12, true);
  line(`Vehicle: ${booking.car.makeModel}`, 11);
  line(`Type/Class: ${booking.car.type}`, 11);
  line(`Daily Rate: $${booking.pricePerDay}/day`, 11);
  line(`Estimated Total: $${Number(booking.totalAmount).toFixed(2)}`, 11);
  hr();

  // Terms
  line("3) Key Terms (MVP)", 12, true);
  line("• Driver must hold a valid U.S. driver’s license and meet minimum age requirements.", 11);
  line("• Vehicle must be returned with the same fuel level as pickup (unless prepaid fuel is selected).", 11);
  line("• Late returns may incur additional daily charges and fees.", 11);
  line("• No smoking in the vehicle. Cleaning fees apply if violated.", 11);
  line("• Customer is responsible for traffic/parking tickets, tolls, and violations.", 11);
  line("• Damage: customer responsible up to deductible; optional coverage may reduce liability.", 11);
  line("• Cancellation: allowed for UPCOMING reservations (subject to policy).", 11);
  hr();

  // Insurance + add-ons
  line("4) Add-ons & Coverage (MVP)", 12, true);
  line(`Add-ons: ${(booking.addOns || []).join(", ") || "None"}`, 11);
  line(`Insurance: ${(booking.insurance || []).join(", ") || "Standard coverage"}`, 11);
  hr();

  // Signatures
  line("5) Signatures (Placeholder)", 12, true);
  line("Customer Signature: ________________________________", 11);
  line("DRIVEFLOW Representative: _________________________", 11);
  y += 6;

  line(
    "Note: This is an MVP-generated agreement for demo purposes. Replace with your official legal agreement before production.",
    10,
    false,
    5
  );

  doc.save(`DRIVEFLOW_Agreement_${booking.reservationNumber}.pdf`);
}
