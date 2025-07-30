export default function promptKindTags(prompt: string, tags: string[]): string {
    return `
You are given a **description** and a predefined **list of tags**. Your task is to carefully analyze the description and **select the most relevant tags** from the list. You may **infer** or **guess** the tags if the match is not explicit, as long as it's reasonable.

### Instructions:
- Return only the tags that best match the description.
- Use only the tags from the provided list.
- Do not invent new tags.
- Think critically about which tags apply.
- The output must be in **valid JSON format**, containing an array of selected tags.

### Available tags:
[${tags.join(', ')}]

### Description:
${prompt}

### Output format:
\`\`\`json
["tag1", "tag2", ...]
\`\`\`
    `;
}