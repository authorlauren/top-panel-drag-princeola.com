import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const PanelElementRow = GObject.registerClass({
    GTypeName: 'PanelOrganizerElementRow',
}, class PanelElementRow extends Adw.ActionRow {
    constructor(label, initialPosition, settings) {
        super({
            title: label,
        });
        this._settings = settings;
        this._label = label;
        const positionModel = new Gtk.StringList();
        positionModel.append("Left");
        positionModel.append("Right");
        this._dropdown = new Gtk.DropDown({
            model: positionModel,
            selected: initialPosition === 'left' ? 0 : 1,
        });
        this._dropdown.connect('notify::selected', this._onPositionChanged.bind(this));
        this.add_suffix(this._dropdown);
        this.activatable_widget = this._dropdown;
    }

    _onPositionChanged() {
        const newPosition = this._dropdown.selected === 0 ? 'left' : 'right';
        let leftElements = this._settings.get_strv('left-elements');
        let rightElements = this._settings.get_strv('right-elements');
        // Remove the element from both arrays to ensure no duplicates
        leftElements = leftElements.filter(e => e !== this._label);
        rightElements = rightElements.filter(e => e !== this._label);
        // Add the element to the appropriate array
        if (newPosition === 'left') {
            leftElements.push(this._label);
        } else {
            rightElements.push(this._label);
        }
        // Update the settings
        this._settings.set_strv('left-elements', leftElements);
        this._settings.set_strv('right-elements', rightElements);
    }
});

export default class PanelOrganizerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        
        // Log the settings to check if they're being retrieved correctly
        console.log('Left elements:', settings.get_strv('left-elements'));
        console.log('Right elements:', settings.get_strv('right-elements'));

        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: 'Panel Element Positions',
            description: 'Choose the position for each panel element',
        });
        page.add(group);

        const leftElements = settings.get_strv('left-elements');
        const rightElements = settings.get_strv('right-elements');
        const allElements = [...new Set([...leftElements, ...rightElements])];
        console.log('All elements:', allElements);

        if (allElements.length === 0) {
            // If there are no elements, add a label explaining this
            const noElementsRow = new Adw.ActionRow({
                title: 'No panel elements found',
            });
            group.add(noElementsRow);
        } else {
            allElements.forEach((element) => {
                const initialPosition = leftElements.includes(element) ? 'left' : 'right';
                const row = new PanelElementRow(element, initialPosition, settings);
                group.add(row);
            });
        }
    }
}
