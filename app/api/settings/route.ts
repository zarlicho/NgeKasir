import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let store = await prisma.store.findFirst();
    if (!store) {
      store = await prisma.store.create({
        data: { name: 'Toko Saya', pin: '123456', taxPercentage: 11 }
      });
    }
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch store settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    let store = await prisma.store.findFirst();
    
    if (store) {
      store = await prisma.store.update({
        where: { id: store.id },
        data: {
          name: data.name !== undefined ? data.name : store.name,
          pin: data.pin !== undefined ? data.pin : store.pin,
          baseQris: data.baseQris !== undefined ? data.baseQris : store.baseQris,
          taxPercentage: data.taxPercentage !== undefined ? data.taxPercentage : store.taxPercentage,
        }
      });
    } else {
      store = await prisma.store.create({
        data: {
          name: data.name || 'Toko Saya',
          pin: data.pin || '123456',
          baseQris: data.baseQris || null,
          taxPercentage: data.taxPercentage || 11,
        }
      });
    }
    
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update store settings' }, { status: 500 });
  }
}
