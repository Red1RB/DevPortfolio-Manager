import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard as Edit, Trash2, Eye, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onViewDetails: (project: Project) => void;
}

const techStackColors: Record<string, string> = {
  "Next.js": "bg-slate-900 text-white",
  "TypeScript": "bg-blue-600 text-white",
  "Tailwind CSS": "bg-cyan-500 text-white",
  "PostgreSQL": "bg-blue-700 text-white",
  "Spring Boot": "bg-green-600 text-white",
  "Java": "bg-orange-600 text-white",
  "MySQL": "bg-blue-500 text-white",
  "JWT": "bg-slate-700 text-white",
  "React Native": "bg-sky-600 text-white",
  "Firebase": "bg-amber-500 text-white",
  "MongoDB": "bg-green-700 text-white",
  "Node.js": "bg-green-600 text-white",
  "Express": "bg-slate-600 text-white",
  "Redis": "bg-red-600 text-white",
  "Docker": "bg-blue-500 text-white",
  "Flutter": "bg-sky-500 text-white",
  "Dart": "bg-blue-600 text-white",
  "GraphQL": "bg-pink-600 text-white",
};

export function ProjectCard({ project, onEdit, onDelete, onViewDetails }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-900">
              {project.name}
            </CardTitle>
            <CardDescription className="mt-2 text-slate-600">
              {project.description}
            </CardDescription>
          </div>
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge
              key={tech}
              className={techStackColors[tech] || "bg-slate-500 text-white"}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => onViewDetails(project)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          onClick={() => onEdit(project)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(project.id)}
          variant="destructive"
          size="sm"
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
