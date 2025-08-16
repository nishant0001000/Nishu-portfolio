import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      return NextResponse.json({ success: false, error: 'CLOUDINARY_CLOUD_NAME not configured' }, { status: 500 })
    }

    // Prefer env preset; fallback to a default that must exist in your Cloudinary
    const presetName = process.env.CLOUDINARY_UPLOAD_PRESET || 'nishant_portfolio'
    // Optional upload folder via env; default to 'projectimages'
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'projectimages'

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const outbound = new FormData()
    outbound.append('file', dataURI)
    outbound.append('upload_preset', presetName)
    if (folder) outbound.append('folder', folder)

    const res = await fetch(cloudinaryUrl, { method: 'POST', body: outbound })
    const text = await res.text()
    if (!res.ok) {
      return NextResponse.json({ success: false, error: text }, { status: 400 })
    }
    let json: any
    try { json = JSON.parse(text) } catch { json = {} }

    return NextResponse.json({ success: true, url: json.secure_url, publicId: json.public_id })
  } catch (error) {
    console.error('Error uploading project image:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload project image' }, { status: 500 })
  }
} 