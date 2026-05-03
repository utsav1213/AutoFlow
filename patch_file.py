with open("src/components/ReachflowEditor.tsx", "r") as f:
    lines = f.readlines()

# Find line starting with "  return (" around line 234
start_index = -1
for i, line in enumerate(lines):
    if 'return' in line and '<div className="w-full h-[800px] border border-gray-800 bg-[#0f0f0f] flex text-white relative flex-row overflow-hidden font-sans">' in lines[i+1]:
        start_index = i
        break

end_index = -1
for i, line in enumerate(lines):
    if 'export default function ReachflowEditor() {' in line:
        end_index = i
        break

if start_index != -1 and end_index != -1:
    with open("new_return.txt", "r") as r:
        new_return = r.read()
    
    new_lines = lines[:start_index] + [new_return + "\n\n"] + lines[end_index:]
    with open("src/components/ReachflowEditor.tsx", "w") as w:
        w.write("".join(new_lines))
    print("Patched!")
else:
    print("Could not find blocks. start:", start_index, "end:", end_index)
