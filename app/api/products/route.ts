import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Map for frontend compatibility
    const mapped = products.map(p => ({
      ...p,
      category: p.category.name
    }));
    
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    let category = await prisma.category.findFirst({ where: { name: data.category }});
    if (!category) {
      category = await prisma.category.create({ data: { name: data.category }});
    }

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock || 0,
        image: data.image,
        categoryId: category.id,
      },
      include: { category: true },
    });
    
    const mappedProduct = {
      ...newProduct,
      category: newProduct.category.name
    };

    return NextResponse.json(mappedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
