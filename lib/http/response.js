import { NextResponse } from 'next/server';

export const json = (data, options = {}) => NextResponse.json(data, options);

export const errorResponse = (error) => {
  const statusCode = error?.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  return NextResponse.json(
    {
      message: error?.message || 'Internal server error.',
    },
    { status: statusCode }
  );
};
