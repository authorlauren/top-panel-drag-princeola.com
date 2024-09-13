import GObject from 'gi://GObject';
import St from 'gi://St';
import Shell from 'gi://Shell';
import Meta from 'gi://Meta';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class PanelOrganizerExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._settings = null;
        this._settingsChanged = null;
        this._originalPanelOrder = null;
    }

    enable() {
        this._settings = this.getSettings();
        this._settingsChanged = this._settings.connect('changed', this._onSettingsChanged.bind(this));
        this._storePanelOrder();
        this._applySettings();
    }

    disable() {
        if (this._settingsChanged) {
            this._settings.disconnect(this._settingsChanged);
            this._settingsChanged = null;
        }
        this._settings = null;
        this._restoreDefaultLayout();
    }

    _onSettingsChanged() {
        this._applySettings();
    }

    _storePanelOrder() {
        const panel = Main.panel;
        this._originalPanelOrder = {
            left: [],
            center: [],
            right: []
        };

        ['_leftBox', '_centerBox', '_rightBox'].forEach(boxName => {
            const box = panel[boxName];
            const boxPosition = boxName.slice(1, -3); // Remove leading underscore and trailing 'Box'
            box.get_children().forEach(child => {
                if (child.constructor.name) {
                    this._originalPanelOrder[boxPosition].push(child.constructor.name);
                }
            });
        });
    }

    _applySettings() {
        const leftElements = this._settings.get_strv('left-elements');
        const rightElements = this._settings.get_strv('right-elements');

        const panel = Main.panel;
        const allChildren = [
            ...panel._leftBox.get_children(),
            ...panel._centerBox.get_children(),
            ...panel._rightBox.get_children()
        ];

        // Remove all children from the panel
        panel._leftBox.remove_all_children();
        panel._centerBox.remove_all_children();
        panel._rightBox.remove_all_children();

        // Add left elements
        leftElements.forEach(element => {
            const child = this._findChildByName(allChildren, element);
            if (child) {
                panel._leftBox.add_child(child);
            }
        });

        // Add right elements
        rightElements.forEach(element => {
            const child = this._findChildByName(allChildren, element);
            if (child) {
                panel._rightBox.add_child(child);
            }
        });

        // Add remaining elements to the center
        allChildren.forEach(child => {
            if (child.get_parent() === null) {
                panel._centerBox.add_child(child);
            }
        });
    }

    _findChildByName(children, name) {
        return children.find(child => child.constructor.name === name);
    }

    _restoreDefaultLayout() {
        if (!this._originalPanelOrder) {
            return;
        }

        const panel = Main.panel;
        const allChildren = [
            ...panel._leftBox.get_children(),
            ...panel._centerBox.get_children(),
            ...panel._rightBox.get_children()
        ];

        panel._leftBox.remove_all_children();
        panel._centerBox.remove_all_children();
        panel._rightBox.remove_all_children();

        ['left', 'center', 'right'].forEach(position => {
            const box = panel[`_${position}Box`];
            this._originalPanelOrder[position].forEach(elementName => {
                const child = this._findChildByName(allChildren, elementName);
                if (child) {
                    box.add_child(child);
                }
            });
        });
    }
}
