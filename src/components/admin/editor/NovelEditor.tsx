"use client";

import {
    EditorRoot,
    EditorContent,
    type JSONContent,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    EditorBubble,
    handleCommandNavigation,
    handleImagePaste,
    handleImageDrop,
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import { uploadFn } from "./image-upload";

import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";

const Separator = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => (
    <div className={orientation === "horizontal" ? "h-[1px] w-full bg-border" : "h-full w-[1px] bg-border"} />
);

interface NovelEditorProps {
    initialValue?: JSONContent;
    onChange: (value: JSONContent) => void;
}

const extensions = [...defaultExtensions, slashCommand];

export default function NovelEditor({ initialValue, onChange }: NovelEditorProps) {
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);

    const debouncedUpdates = useDebouncedCallback(async (editor) => {
        const json = editor.getJSON();
        onChange(json);
    }, 500);

    return (
        <div className="relative w-full border rounded-lg bg-background text-foreground" data-lenis-prevent>
            <EditorRoot>
                <EditorContent
                    initialContent={initialValue}
                    extensions={extensions as any}
                    immediatelyRender={false}
                    className="min-h-[200px] max-h-[500px] overflow-y-auto sm:min-h-[300px] w-full p-4"
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event),
                        },
                        handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
                        handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
                        attributes: {
                            class: "prose prose-lg dark:prose-invert prose-headings:font-title font-sans leading-normal focus:outline-none max-w-full",
                        },
                    }}
                    onUpdate={({ editor }) => {
                        debouncedUpdates(editor);
                    }}
                >
                    <EditorCommand
                        className="z-[99999] h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                        disablePointerSelection={false}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) => item.command?.(val)}
                                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                                    key={item.title}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>

                    <EditorBubble
                        tippyOptions={{
                            duration: 100,
                        }}
                        className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
                    >
                        <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                        <Separator orientation="vertical" />
                        <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                        <Separator orientation="vertical" />
                        <MathSelector />
                        <Separator orientation="vertical" />
                        <TextButtons />
                        <Separator orientation="vertical" />
                        <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                    </EditorBubble>
                </EditorContent>
            </EditorRoot>
        </div>
    );
}
