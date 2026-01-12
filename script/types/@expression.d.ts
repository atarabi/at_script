declare namespace Atarabi {

    namespace Expression {

        interface Action {
            namespace: "@expression";
            scope: string;
            action: string;
        }

        namespace Control {

            interface CreateAction extends Action {
                scope: "@control";
                action: "create";
                payload: SettingsWithType;
            }

            type SettingsWithType =
                | ThreeDPointSettings & { type: "3D Point"; }
                | AngleSettings & { type: "Angle"; }
                | CheckboxSettings & { type: "Checkbox"; }
                | ColorSettings & { type: "Color"; }
                | DropdownMenuSettings & { type: "Dropdown Menu"; }
                | LayerSettings & { type: "Layer"; }
                | PointSettings & { type: "Point"; }
                | SliderSettings & { type: "Slider"; }
                ;

            type ThreeDPointSettings = {
                name: string;
                value?: [x: number, y: number, z: number]; // percent
                expression?: string;
            };

            type AngleSettings = {
                name: string;
                value?: number;
                expression?: string;
            };

            type CheckboxSettings = {
                name: string;
                value?: boolean | number;
                expression?: string;
            };

            type ColorSettings = {
                name: string;
                value?: [red: number, green: number, blue: number, alpha: number];
                expression?: string;
            };

            type DropdownMenuSettings = {
                name: string;
                items: string[];
                value?: number;
                expression?: string;
            };

            type LayerSettings = {
                name: string;
            };

            type PointSettings = {
                name: string;
                value?: [x: number, y: number]; // percent
                expression?: string;
            };

            type SliderSettings = {
                name: string;
                value?: number;
                expression?: string;
            };
        }

        namespace Pseudo {

            interface CreateAction extends Expression.Action {
                scope: "@pseudo";
                action: "create";
                payload: Atarabi.Pseudo.Config;
            }
            
        }

    }

}
