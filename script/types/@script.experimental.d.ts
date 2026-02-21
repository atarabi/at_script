declare namespace Atarabi {

    interface Keyboard {
        // windows only
        setNativeInput(enabled: boolean): void;

        // windows only
        isNativeInput(): boolean;
    }

}
