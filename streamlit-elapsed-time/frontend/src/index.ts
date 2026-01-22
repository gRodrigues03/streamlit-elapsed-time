import {
    FrontendRenderer,
    FrontendRendererArgs,
} from "@streamlit/component-v2-lib";

export type ComponentData = {
    date: string;
};

type InstanceState = {
    date: Date;
    intervalId: number;
};

const instances = new WeakMap<
  FrontendRendererArgs["parentElement"],
  InstanceState
>();

function getTimeDifference(date: Date): string {
    const diffMs = Date.now() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const prefix = "Salvo há ";

    if (days > 0) {
        return `${prefix}${days} dias, ${hours % 24} horas, ${minutes % 60} minutos e ${seconds % 60} segundos`;
    }

    if (hours > 0) {
        return `${prefix}${hours % 24} horas, ${minutes % 60} minutos e ${seconds % 60} segundos`;
    }

    if (minutes > 0) {
        return `${prefix}${minutes % 60} minutos e ${seconds % 60} segundos`;
    }

    return `${prefix}${seconds % 60} segundos`;
}

function render(parent: HTMLElement, date: Date): void {
    const el = parent.querySelector<HTMLElement>("#t-el");
    if (!el) return;

    el.innerText = getTimeDifference(date);
}

const MyComponent: FrontendRenderer<ComponentData> = (args) => {
    const { parentElement, data } = args;
    if (!data?.date) return;

    let state = instances.get(parentElement);

    // First render for this instance
    if (!state) {
        const date = new Date(data.date);

        const intervalId = window.setInterval(() => {
            render(parentElement, date);
        }, 1000);

        state = { date, intervalId };
        instances.set(parentElement, state);
    } else {
        // Update date if Streamlit re-renders
        state.date = new Date(data.date);
    }

    render(parentElement, state.date);

    // Proper cleanup
    return () => {
        const state = instances.get(parentElement);
        if (!state) return;

        clearInterval(state.intervalId);
        instances.delete(parentElement);
    };
};

export default MyComponent;
