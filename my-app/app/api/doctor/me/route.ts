import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { Doctor } from "@/model/Doctor";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const doctor = await Doctor.findOne({ doctorId: session.user.id }).lean();
  if (!doctor) {
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json(doctor);
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const updatedDoctor = await Doctor.findOneAndUpdate(
    { doctorId: session.user.id },
    {
      name: data.name,
      licenseNumber: data.licenseNumber,
      specialty: data.specialty,
      description: data.description,
    },
    { new: true }
  ).lean();

  if (!updatedDoctor) {
    return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json(updatedDoctor);
}
