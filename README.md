# Panel Organizer GNOME Extension

## Overview

Panel Organizer is a GNOME Shell extension that allows users to customize the layout of their top panel by rearranging system elements. With this extension, you can move panel elements like the Activities button, App Menu, Date/Time, and System Menu between the left and right sides of the panel.

## Features

- Ability to move elements to the left or right side of the panel
- Persistent layout that stays consistent across sessions
- Compatible with GNOME Shell 45 and 46

## Installation

### From GNOME Extensions Website

1. Visit the [Top Panel Organizer page on GNOME Extensions](https://extensions.gnome.org/extension/[your-extension-id])
2. Click on the toggle switch to install the extension
3. Allow the browser to install the extension when prompted

### Manual Installation

1. Clone this repository:
2. git clone https://github.com/authourlauren/top-panel-drag-princeola.com.git
3. Copy the extension to the GNOME Shell extensions directory:
4. cp -r panel-organizer ~/.local/share/gnome-shell/extensions/top-panel-drag-princeola.com

5. Restart the GNOME Shell:
- Press `Alt+F2`, type `r`, and press `Enter`
- Or log out and log back in
6. Enable the extension using GNOME Extensions app or GNOME Tweaks tool

## Usage

1. Open the GNOME Extensions app
2. Find "Panel Organizer" in the list and click on the settings icon
3. In the settings window, you can drag and drop panel elements to rearrange them
4. Changes are applied immediately

## Configuration

The extension stores its configuration in GSettings. You can modify these settings using the graphical interface provided by the extension or via the command line using `gsettings`:

```bash
gsettings set org.gnome.shell.extensions.panel-organizer left-elements "['Activities', 'AppMenu']"
gsettings set org.gnome.shell.extensions.panel-organizer right-elements "['DateMenu', 'SystemMenu']"

Development
To contribute to Panel Organizer or modify it for your own use:

Clone the repository
Make your changes
Test the extension by symlinking it to the GNOME Shell extensions directory:
ln -s /path/to/your/panel-organizer ~/.local/share/gnome-shell/extensions/top-panel-drag-princeola.com

Restart the GNOME Shell to load your changes

License
This project is licensed under the MIT License.
Support
If you encounter any issues or have suggestions, please open an issue on GitHub.
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
