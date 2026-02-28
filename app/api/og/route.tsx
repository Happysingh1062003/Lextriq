import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const categoryColors: Record<string, string> = {
    Coding: '#F4F0EA',
    Developing: '#EAEFF0',
    'UI/UX': '#EAEFF0',
    Designing: '#EAEFF0',
    Creatives: '#F0EAEB',
    Creative: '#F0EAEB',
    Writing: '#CDEDF6',
    Marketing: '#FCE7F3',
    Other: '#F4F4F5',
};

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const title = searchParams.get('title') || 'Untitled Prompt';
    const category = searchParams.get('category') || 'Other';
    const author = searchParams.get('author') || 'Anonymous';
    const upvotes = searchParams.get('upvotes') || '0';

    const bgColor = categoryColors[category] || '#F4F4F5';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#F6F6F6',
                    padding: '60px 70px',
                    fontFamily: 'Georgia, serif',
                }}
            >
                {/* Top: Logo + Category */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#000',
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 20,
                            fontWeight: 700,
                        }}>
                            L
                        </div>
                        <span style={{ fontSize: 28, color: '#1A1A1A', letterSpacing: '-0.04em' }}>
                            Lextriq
                        </span>
                    </div>
                    <div style={{
                        backgroundColor: bgColor,
                        padding: '8px 20px',
                        borderRadius: 8,
                        fontSize: 18,
                        color: '#555',
                        fontWeight: 500,
                    }}>
                        {category}
                    </div>
                </div>

                {/* Center: Title */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    gap: '16px',
                }}>
                    <div style={{
                        fontSize: title.length > 60 ? 42 : 52,
                        color: '#1A1A1A',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        maxHeight: '200px',
                    }}>
                        {title.length > 100 ? title.slice(0, 100) + '…' : title}
                    </div>
                </div>

                {/* Bottom: Author + Stats */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    paddingTop: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            backgroundColor: '#E5E5E5',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            color: '#666',
                        }}>
                            {author.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 18, color: '#666' }}>
                            {author}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: 18, color: '#999' }}>▲</span>
                        <span style={{ fontSize: 18, color: '#666' }}>{upvotes}</span>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
