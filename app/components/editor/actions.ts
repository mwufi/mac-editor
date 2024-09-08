import { toast } from "sonner";
import { uploadImageToSupabase } from "@/app/utils/supabase";

export async function uploadAndInsertImage(editor, file, pos = null) {
    toast.info("Uploading image to cloud....")
    try {
        const supabasePath = await uploadImageToSupabase(file)
        console.log("Supabase path", supabasePath)

        editor.chain().insertContent([
            {
                type: 'nextImage',
                attrs: {
                    src: supabasePath,
                },
            },
            {
                type: 'paragraph'
            },
        ]).focus().run()
    } catch (error) {
        toast.error('Error uploading image:', error.message);
    }
}

export function insertImageUrl(editor, url) {
    editor.chain().insertContent([
        {
            type: 'nextImage',
            attrs: {
                src: url,
            },
        },
        {
            type: 'paragraph'
        }
    ]).focus().run()
}

export const insertCustomButton = (editor, label, onClick) => {
    editor
        .chain()
        .focus()
        .insertContent([{
            type: 'customButton',
            attrs: {
                label,
                onClick: onClick ? onClick.toString() : null,
            },
        },
        {
            type: 'paragraph'
        }
        ])
        .run();
};

export const insertGallery = (editor) => {
    editor
        .chain()
        .focus()
        .insertContent([{
            type: 'customImageGallery',
            attrs: {
                layout: 'carousel',
                images: [],
                caption: '',
            },
        },
        {
            type: 'paragraph'
        }
        ])
        .run();
};
