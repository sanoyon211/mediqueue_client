import { auth } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = session.user;

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
