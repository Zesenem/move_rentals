import { Component } from "react";
import ErrorFallback from "./ErrorFallback.jsx";
import { reportError } from "../services/monitoring.js";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportError(error, info.componentStack);
  }

  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
