import { Project } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectDetailsDialog({ isOpen, onClose, project }: ProjectDetailsDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.name}</DialogTitle>
          <DialogDescription className="text-base">
            Project Details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Category
            </h3>
            <Badge variant="outline" className="text-base px-3 py-1">
              {project.category}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-slate-700 leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
