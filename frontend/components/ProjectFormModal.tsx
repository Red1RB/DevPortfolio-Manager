"use client";

import { useState, useEffect } from "react";
import { Project } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, "id"> | Project) => void;
  project?: Project | null;
}

const availableTechs = [
  "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL",
  "Spring Boot", "Java", "MySQL", "JWT",
  "React Native", "Firebase", "MongoDB",
  "Node.js", "Express", "Redis", "Docker",
  "Flutter", "Dart", "GraphQL", "Python",
  "Django", "React", "Vue.js", "Angular",
];

const categoryOptions = ["Web Apps", "Mobile Apps", "APIs"];

export function ProjectFormModal({ isOpen, onClose, onSave, project }: ProjectFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setCategory(project.category);
      setTechStack(project.techStack);
    } else {
      setName("");
      setDescription("");
      setCategory("");
      setTechStack([]);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !category || techStack.length === 0) {
      alert("Please fill in all fields and add at least one technology");
      return;
    }

    const projectData = {
      name,
      description,
      category,
      techStack,
    };

    if (project) {
      onSave({ ...projectData, id: project.id });
    } else {
      onSave(projectData);
    }

    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setCategory("");
    setTechStack([]);
    setTechInput("");
    onClose();
  };

  const addTech = (tech: string) => {
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update the details of your project."
              : "Add a new project to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Select value={techInput} onValueChange={addTech}>
                <SelectTrigger>
                  <SelectValue placeholder="Add technologies..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTechs
                    .filter((tech) => !techStack.includes(tech))
                    .map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer hover:bg-slate-300"
                    onClick={() => removeTech(tech)}
                  >
                    {tech}
                    <X className="h-3 w-3 ml-2" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
