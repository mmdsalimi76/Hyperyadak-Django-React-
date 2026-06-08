import React from "react";
import { BrowserRouter } from "react-router-dom";
import ServerError from "./500";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Wrapping with BrowserRouter injects the missing context required by <Link>
      return (
        <BrowserRouter>
          <ServerError />
        </BrowserRouter>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
