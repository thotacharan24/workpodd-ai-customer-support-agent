from typing import Any, Callable, Dict, List

class Tool:
    def __init__(self, func: Callable[..., Any]):
        self.func = func
        self.__name__ = func.__name__

    def __call__(self, *args, **kwargs):
        return self.func(*args, **kwargs)

    def __get__(self, instance, owner):
        return self.func.__get__(instance, owner)


def tool(func: Callable[..., Any]) -> Tool:
    return Tool(func)

class StateGraph:
    def __init__(self, name: str):
        self.name = name
        self.states: Dict[str, Callable[..., Any]] = {}
        self.transitions: Dict[str, str] = {}

    def add_state(self, name: str, handler: Callable[..., Any], next_state: str | None = None):
        self.states[name] = handler
        if next_state is not None:
            self.transitions[name] = next_state

    def run(self, initial_state: str, **kwargs) -> Any:
        state_name = initial_state
        context = kwargs.copy()
        while state_name:
            handler = self.states.get(state_name)
            if handler is None:
                raise ValueError(f"State '{state_name}' not found in graph '{self.name}'")
            context = handler(context)
            if not isinstance(context, dict):
                return context
            state_name = self.transitions.get(state_name)
        return context
