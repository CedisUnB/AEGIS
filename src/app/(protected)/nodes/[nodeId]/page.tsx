import { getLessonContentAction } from "@/features/content";
import { ReadingNodeView } from "@/features/content/components/ReadingNodeView";
import { notFound } from "next/navigation";

interface ReadingPageProps {
    params: Promise<{ nodeId: string }>
}

export default async function ReadingPage({
    params
}: ReadingPageProps) {
    const { nodeId: nodeIdParam } = await params;
    const nodeId = Number(nodeIdParam);

    if (!Number.isSafeInteger(nodeId) || nodeId < 1 || nodeId > 2_147_483_647) {
        notFound();
    }

    const result = await getLessonContentAction(nodeId);

    if (!result.success) {
        throw new Error(result.error)
    }

    return (
        <main>
            <ReadingNodeView 
                lesson={result.data}
                trackTitle={result.data.title} // Alterar para enviar o título da trilha na integração
                trackId={result.data.trackId}
            />
        </main>
    )
}