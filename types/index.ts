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

export interface RoomValues {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomTypeName;
  maxOccupancy: number;
  pricePerNight: number;
  status: RoomStatus;
  description: string;
  images: string[];
  createdAt: string;
}

// ─── Booking Types ─────────────────────────────────────────────────────────────

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "WAITING_REVIEW" | "APPROVED" | "REJECTED";

export interface Booking {
  id: string;
  code: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestCount: number;
  totalAmount: string;
  status: BookingStatus;
  note: string | null;
  paymentDeadline: string | null;
  createdAt: string;
  updatedAt: string;

  room: Room;
  user: User;
  payment?: Payment | null;
}

export type SearchParams = {
  checkIn: string;
  checkOut: string;
  guests: number;
  type: RoomTypeName | "ALL";
  maxPrice: number;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phoneNumber: string;
};

export type MyBooking = {
  id: string;
  code: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestCount: number;
  totalAmount: number;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
  payment?: Payment | null;

  room: {
    roomNumber: string;
    type: RoomTypeName;
    floor: number;
    images: string[];
  };
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: string; // Prisma Decimal → string
  slipUrl: string;
  status: PaymentStatus;
  note: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
