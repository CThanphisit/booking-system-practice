// ─── Room Types ───────────────────────────────────────────────────────────────

export type RoomStatus = "AVAILABLE" | "MAINTENANCE" | "INACTIVE";

export type RoomTypeName = "Standard" | "Deluxe" | "Suite" | "Family";

export type Room = {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomTypeName;
  maxOccupancy: number;
  pricePerNight: number;
  status: RoomStatus;
  amenities: string[];
  images: string[];
  description: string;
  createdAt: string;
};

export type RoomFormValues = {
  roomNumber: string;
  floor: number;
  type: RoomTypeName;
  maxOccupancy: number;
  pricePerNight: number;
  status: RoomStatus;
  amenities: string[];
  description: string;
};

// ─── Booking Types ─────────────────────────────────────────────────────────────

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export type Booking = {
  id: string;
  code: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  room: {
    id: string;
    roomNumber: string;
    type: RoomTypeName;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  note?: string;
};
