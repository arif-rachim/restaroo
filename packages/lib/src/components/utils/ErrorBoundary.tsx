import {Component, ErrorInfo} from "react";
import {red} from "../Theme";
import {GiHammerBreak} from "react-icons/gi";

export class ErrorBoundary extends Component {
    constructor(props: any) {
        super(props);
        this.state = {hasError: false, error: undefined};
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        console.log('WE HAVE ERROR ', error);
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        const {error, hasError} = (this.state as any);
        if (hasError) {
            // You can render any custom fallback UI
            return <div style={{color: red, fontSize: 22}} title={error.message}><GiHammerBreak/></div>;
        }
        return (this.props as any).children;
    }
}