import Customer from "@/models/Customer";

// GET all customers
export async function GET() {
  const customers = await Customer.find();
  return Response.json(customers);
}

// POST new customer
export async function POST(request) {
  const body = await request.json();
  console.log("Request Body:", body);
  const newCustomer = new Customer(body);
  await newCustomer.save();
  return Response.json(newCustomer);
}

// PUT existing customer
export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}

// PATCH existing customer (optional, similar to PUT)
export async function PATCH(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}
