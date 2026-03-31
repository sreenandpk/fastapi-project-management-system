from pydantic import BaseModel
class DashboardStats(BaseModel):
    total_tasks: int
    todo: int
    in_progress: int
    done: int
    my_tasks: int
    projects: int