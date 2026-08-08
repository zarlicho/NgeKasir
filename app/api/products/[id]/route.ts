import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    let categoryId = undefined;
    if (data.category) {
      let category = await prisma.category.findFirst({ where: { name: data.category }});
      if (!category) {
        category = await prisma.category.create({ data: { name: data.category }});
      }
      categoryId = category.id;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
        image: data.image,
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
    });
    
    const mappedProduct = {
      ...updatedProduct,
      category: updatedProduct.category.name
    };

    return NextResponse.json(mappedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
