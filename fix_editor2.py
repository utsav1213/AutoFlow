with open("src/components/ReachflowEditor.tsx", "r") as f:
    content = f.read()

start_index = content.find('  return (\n    <div className="w-full h-[800px]"')
if start_index == -1:
    start_index = content.find('  return (\n    <div className="w-full h-[800px] border border-gray-800 bg-[#0f0f0f] flex text-white relative flex-row overflow-hidden font-sans">')
end_index = content.find('export default function ReachflowEditor() {')

if start_index != -1 and end_index != -1:
    with open("new_return.txt", "r") as r:
        new_return = r.read()
    
    new_content = content[:start_index] + new_return + "\n\n" + content[end_index:]
    with open("src/components/ReachflowEditor.tsx", "w") as f:
        f.write(new_content)
    print("Replaced!")
else:
    print("Not found", start_index, end_index)
