
import os

def fix_import_paths(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".tsx"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r") as f:
                content = f.read()

            new_content = content.replace('import { cn } from "@/lib/utils";', 'import { cn } from "../../lib/utils";')
            new_content = new_content.replace('import { buttonVariants } from "@/components/ui/button";', 'import { buttonVariants } from "./button";')

            if new_content != content:
                with open(filepath, "w") as f:
                    f.write(new_content)
                print(f"Fixed imports in {filepath}")

fix_import_paths("src/components/ui")
