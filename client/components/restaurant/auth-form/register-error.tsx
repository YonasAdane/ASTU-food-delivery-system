import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function RegisterError() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Form Error</AlertTitle>
      <AlertDescription>
        Too many validation errors. Please refresh and try again.
      </AlertDescription>
    </Alert>
  );
}
