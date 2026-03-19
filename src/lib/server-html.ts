import sanitizeHtml from 'sanitize-html';

const escapeHtml = (text: string) => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const renderNode = (node: any): string => {
    if (!node) return '';

    if (node.type === 'text') {
        let text = escapeHtml(node.text || '');
        if (node.marks) {
            node.marks.forEach((mark: any) => {
                if (mark.type === 'bold') text = `<strong>${text}</strong>`;
                else if (mark.type === 'italic') text = `<em>${text}</em>`;
                else if (mark.type === 'strike') text = `<s>${text}</s>`;
                else if (mark.type === 'underline') text = `<u>${text}</u>`;
                else if (mark.type === 'code') text = `<code class="rounded-md bg-muted px-1.5 py-1 font-mono font-medium">${text}</code>`;
                else if (mark.type === 'link') {
                    const attrs = mark.attrs || {};
                    let href = attrs.href || '#';
                    let target = attrs.target;
                    let rel = attrs.rel;

                    try {
                        const url = new URL(href, 'http://dummy.com');
                        const protocol = url.protocol.toLowerCase();
                        if (!['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
                            href = '#';
                        }
                    } catch (e) {
                        href = '#';
                    }

                    const allowedTargets = ['_blank', '_self', '_parent', '_top'];
                    if (!allowedTargets.includes(target)) {
                        target = '';
                    }

                    const allowedRels = ['noopener', 'noreferrer', 'nofollow'];
                    if (rel) {
                        rel = rel.split(/\s+/).filter((r: string) => allowedRels.includes(r.toLowerCase())).join(' ');
                    }

                    const safeHref = escapeHtml(href);
                    const safeTarget = target ? ` target="${escapeHtml(target)}"` : '';
                    const safeRel = rel ? ` rel="${escapeHtml(rel)}"` : '';

                    text = `<a href="${safeHref}"${safeTarget}${safeRel} class="text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer">${text}</a>`;
                }
                else if (mark.type === 'textStyle') {
                    const color = mark.attrs?.color;
                    if (color && /^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/i.test(color)) {
                        text = `<span style="color: ${color}">${text}</span>`;
                    }
                }
                else if (mark.type === 'highlight') {
                    const color = mark.attrs?.color;
                    if (color && /^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/i.test(color)) {
                        text = `<mark style="background-color: ${color}">${text}</mark>`;
                    } else {
                        text = `<mark>${text}</mark>`;
                    }
                }
            });
        }
        return text;
    }

    const children = node.content ? node.content.map(renderNode).join('') : '';

    switch (node.type) {
        case 'doc': return children;
        case 'paragraph': return `<p class="my-2">${children}</p>`;
        case 'heading': {
            const rawLevel = Number(node.attrs?.level);
            const level = !isNaN(rawLevel) ? Math.max(1, Math.min(6, rawLevel)) : 2;
            return `<h${level} class="mt-6 mb-2">${children}</h${level}>`;
        }
        case 'bulletList':
            return `<ul class="list-disc list-outside leading-3 -mt-2 ml-4">${children}</ul>`;
        case 'orderedList':
            return `<ol class="list-decimal list-outside leading-3 -mt-2 ml-4">${children}</ol>`;
        case 'listItem':
            return `<li class="leading-normal -mb-2">${children}</li>`;
        case 'blockquote':
            return `<blockquote class="border-l-4 border-primary pl-4 py-1">${children}</blockquote>`;
        case 'codeBlock':
            return `<pre class="rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"><code>${children}</code></pre>`;
        case 'image':
            const src = escapeHtml(node.attrs?.src || '');
            const alt = escapeHtml(node.attrs?.alt || '');
            const title = escapeHtml(node.attrs?.title || '');
            const width = node.attrs?.width;

            let style = '';
            if (width) {
                const widthStr = String(width).trim();
                if (/^\d+(?:\.\d+)?(?:px|%|em|rem|vw|vh)?$/.test(widthStr)) {
                    const finalWidth = /^\d+(?:\.\d+)?$/.test(widthStr) ? `${widthStr}px` : widthStr;
                    style = ` style="width: ${finalWidth}"`;
                }
            }

            return `<img src="${src}" alt="${alt}" title="${title}"${style} class="rounded-lg border border-muted" />`;
        case 'youtube': {
            const rawSrc = String(node.attrs?.src || '');
            const rawStart = node.attrs?.start;
            const rawWidth = node.attrs?.width;
            const rawHeight = node.attrs?.height;

            const idRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = rawSrc.match(idRegex);
            const videoId = match ? match[1] : null;

            if (!videoId) return '';

            let startParam = '';
            if (rawStart !== undefined && rawStart !== null) {
                const startInt = parseInt(String(rawStart), 10);
                if (!isNaN(startInt) && startInt >= 0) {
                    startParam = `?start=${startInt}`;
                }
            }

            const dimensionRegex = /^\d+(?:\.\d+)?(?:px|%|em|rem|vw|vh)?$/;

            let width = '100%';
            if (rawWidth && dimensionRegex.test(String(rawWidth))) {
                width = String(rawWidth);
            }

            let height = '360';
            if (rawHeight && dimensionRegex.test(String(rawHeight)) && String(rawHeight) !== 'auto') {
                height = String(rawHeight);
            }

            const embedUrl = `https://www.youtube.com/embed/${videoId}${startParam}`;

            const safeUrl = escapeHtml(embedUrl);
            const safeWidth = escapeHtml(width);
            const safeHeight = escapeHtml(height);

            return `<div data-youtube-video><iframe src="${safeUrl}" width="${safeWidth}" height="${safeHeight}" allowfullscreen frameborder="0"></iframe></div>`;
        }
        case 'hardBreak':
            return '<br>';
        case 'horizontalRule':
            return '<hr class="mt-4 mb-6 border-t border-muted-foreground" />';
        default:
            return children;
    }
}


export const generateHtml = (json: any) => {
    if (!json) return ''
    try {
        let content = json;

        if (typeof content === 'string') {
            try {
                let parsed = JSON.parse(content);
                if (typeof parsed === 'string') {
                    try {
                        parsed = JSON.parse(parsed);
                    } catch (e) {
                    }
                }
                content = parsed;
            } catch (e) {
                return sanitizeHtml(`<p>${escapeHtml(content)}</p>`, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
                    allowedAttributes: {
                        ...sanitizeHtml.defaults.allowedAttributes,
                        '*': ['class'],
                        'img': ['src', 'alt', 'title', 'width', 'height', 'style']
                    },
                    allowedStyles: {
                        '*': {
                            'color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                            'background-color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                            'width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                            'height': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                            'max-width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                            'display': [/^block$/, /^inline$/, /^inline-block$/]
                        }
                    }
                });
            }
        }

        if (!content || typeof content !== 'object') {
            return sanitizeHtml(`<p>${escapeHtml(String(content))}</p>`, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    '*': ['class'],
                    'img': ['src', 'alt', 'title', 'width', 'height', 'style']
                },
                allowedStyles: {
                    '*': {
                        'color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                        'background-color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                        'width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                        'height': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                        'max-width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                        'display': [/^block$/, /^inline$/, /^inline-block$/]
                    }
                }
            });
        }

        if (!content.type) {
            if (Array.isArray(content)) {
                content = { type: 'doc', content }
            } else if (content.content && Array.isArray(content.content)) {
                content = { ...content, type: 'doc' }
            } else {
                return ''
            }
        }

        const rawHtml = renderNode(content);

        return sanitizeHtml(rawHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'img', 'iframe', 'u', 's', 'span', 'mark'
            ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['class', 'style'],
                'a': ['href', 'target', 'rel', 'class'],
                'img': ['src', 'alt', 'title', 'style', 'class', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'class', 'style'],
                'span': ['class', 'style'],
                'mark': ['class', 'style']
            },
            allowedIframeHostnames: ['www.youtube.com', 'youtu.be', 'player.vimeo.com'],
            allowedStyles: {
                '*': {
                    'color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                    'background-color': [/^(#[0-9a-fA-F]{3,8}|rgba?\(.*?\)|hsla?\(.*?\)|[a-z]+|var\(--[a-zA-Z0-9-]+\))$/],
                    'width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                    'height': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                    'max-width': [/^\d+(?:px|%|em|rem|vw|vh)?$/],
                    'display': [/^block$/, /^inline$/, /^inline-block$/]
                }
            },
            allowedSchemes: ['http', 'https', 'mailto', 'tel'],
            allowedSchemesAppliedToAttributes: ['href', 'src', 'cite']
        });

    } catch (e) {
        console.error('Error generating HTML from JSON:', e)
        return ''
    }
}
