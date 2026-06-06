import { useNavigate } from "react-router-dom";
import { MealIcon } from "../constants/icons";
import Button from "../components/ui/Button";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center space-y-5 shadow-sm">
        {/* icon */}
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <MealIcon className="w-8 h-8 text-gray-400" />
        </div>

        {/* text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-text-primary">
            No meal plan yet
          </h3>
          <p className="text-sm text-text-muted">
            Set your preferences to generate your first weekly plan.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/weekly-plan")}
          className="w-full uppercase tracking-widest text-sm font-bold"
        >
          Create Plan
        </Button>

        <p className="text-xs text-text-muted">Takes less than 2 minutes</p>
      </div>
    </div>
  );
};

export default EmptyState;
