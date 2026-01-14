declare namespace Atarabi {

    namespace Expression {

        interface Action {
            namespace: "@expression";
            scope: string;
            action: string;
        }

        namespace Effect {

            type Actions = CreateEffectAction | CreateExpressionControlAction | CreatePseudoAction;

            interface CreateEffectAction extends Action {
                scope: "@effect";
                action: "createEffect";
                payload: EffectSettings;
            }

            interface CreateExpressionControlAction extends Action {
                scope: "@effect";
                action: "createExpressionControl";
                payload: ExpressionControlSettings;
            }

            interface CreatePseudoAction extends Action {
                scope: "@effect";
                action: "createPseudo";
                payload: Atarabi.Pseudo.Config;
            }

            interface EffectSettings {
                matchName: string;
                name: string;
                parameters?: {
                    [matchName: string]: {
                        value?: any;
                        expression?: string;
                    },
                };
            }

            type ExpressionControlSettings =
                | ThreeDPointSettings
                | AngleSettings
                | CheckboxSettings
                | ColorSettings
                | DropdownMenuSettings
                | LayerSettings
                | PointSettings
                | SliderSettings
                ;

            type ThreeDPointSettings = {
                type: "3D Point";
                name: string;
                value?: [x: number, y: number, z: number]; // percent
                expression?: string;
            };

            type AngleSettings = {
                type: "Angle";
                name: string;
                value?: number;
                expression?: string;
            };

            type CheckboxSettings = {
                type: "Checkbox";
                name: string;
                value?: boolean | number;
                expression?: string;
            };

            type ColorSettings = {
                type: "Color";
                name: string;
                value?: [red: number, green: number, blue: number, alpha: number];
                expression?: string;
            };

            type DropdownMenuSettings = {
                type: "Dropdown Menu";
                name: string;
                items: string[];
                value?: number;
                expression?: string;
            };

            type LayerSettings = {
                type: "Layer";
                name: string;
            };

            type PointSettings = {
                type: "Point";
                name: string;
                value?: [x: number, y: number]; // percent
                expression?: string;
            };

            type SliderSettings = {
                type: "Slider";
                name: string;
                value?: number;
                expression?: string;
            };
        }

        namespace Font {

            type Actions = BakeFavoritesAction | BakeAllAction;

            interface BakeFavoritesAction extends Action {
                scope: "@font";
                action: "bakeFavorites";
                payload: [line: number, column: number];
            }

            interface BakeAllAction extends Action {
                scope: "@font";
                action: "bakeAll";
                payload: [line: number, column: number];
            }

        }

        namespace Property {

            type Actions = BakeValueAction;

            interface BakeValueAction extends Action {
                scope: "@property";
                action: "bakeValue";
                payload: {
                    position: [line: number, column: number];
                    indices: number[];
                    time: number;
                    preExpression: boolean;
                };
            }

        }

    }

}
