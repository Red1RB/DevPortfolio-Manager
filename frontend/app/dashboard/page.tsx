"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { ProjectDetailsDialog } from "@/components/ProjectDetailsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Project, Category } from "@/lib/types";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Loader as Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All Projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  useEffect(() => {
    filterProjects();
  }, [selectedCategory, projects]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await api.getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (selectedCategory === "All Projects") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === selectedCategory));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredProjects.findIndex((p) => p.id === active.id);
      const newIndex = filteredProjects.findIndex((p) => p.id === over.id);

      const newFilteredOrder = arrayMove(filteredProjects, oldIndex, newIndex);
      setFilteredProjects(newFilteredOrder);

      const updatedProjects = [...projects];
      const movedProject = updatedProjects.find((p) => p.id === active.id);
      if (movedProject) {
        updatedProjects.splice(updatedProjects.indexOf(movedProject), 1);
        const targetIndex = updatedProjects.findIndex((p) => p.id === over.id);
        updatedProjects.splice(targetIndex, 0, movedProject);
        setProjects(updatedProjects);

        try {
          await api.reorderProjects(updatedProjects);
          toast({
            title: "Success",
            description: "Projects reordered successfully",
          });
        } catch (error) {
          console.error("Failed to reorder projects:", error);
          setProjects(projects);
          filterProjects();
          toast({
            title: "Error",
            description: "Failed to reorder projects. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, "id">) => {
    try {
      const newProject = await api.createProject(projectData);
      setProjects([...projects, newProject]);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const updated = await api.updateProject(updatedProject.id, updatedProject);
      const updatedProjects = projects.map((p) =>
        p.id === updated.id ? updated : p
      );
      setProjects(updatedProjects);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await api.deleteProject(id);
      const updatedProjects = projects.filter((p) => p.id !== id);
      setProjects(updatedProjects);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleSaveProject = (projectData: Omit<Project, "id"> | Project) => {
    if ("id" in projectData) {
      handleUpdateProject(projectData as Project);
    } else {
      handleCreateProject(projectData);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    setViewingProject(project);
    setIsDetailsOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setViewingProject(null);
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <Layout showAuth>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Projects</h2>
            <p className="text-slate-600 mt-1">
              Manage and organize your development portfolio
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            size="lg"
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl shadow-md p-12">
              <p className="text-xl text-slate-600">
                No projects found in this category.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredProjects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <ProjectDetailsDialog
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        project={viewingProject}
      />
    </Layout>
  );
}
