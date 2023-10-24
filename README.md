# Cumulocity Note Widget Plugin

Use the Note Widget to easily manage notes for devices and assets. Users can add new notes or extend existing ones. These notes will be shared with all users, who have access to the related device/asset and its dashboards. Each note update is stored as an event for the corresponding device/assets. Using the log section users can have a look on past notes.

**Important:** Users need to have `READ` and `ADMIN` permission on the Events API, as notes and updates on notes are stored as events.

![alt notes widget](/assets/preview.gif)

## Local development

### Recommended version

- node version >= 16.x
- npm version 6.x

### Plugin versions

- Angular version 14.x
- WebSDK version 1017.0.x

**How to start**
Change the target tenant and application you want to run this plugin on in the `package.json`.

```
c8ycli server -u https://{{your-tenant}}.cumulocity.com/ --shell {{cockpit}}
```

Keep in mind that this plugin needs to have an app (e.g. cockpit) running with at least the same version as this plugin. if your tenant contains an older version, use the c8ycli to create a cockpit clone running with at least v 1017.0.x! Upload this clone to the target tenant (e.g. cockpit-1017) and reference this name in the --shell command.

The widget plugin can be locally tested via the start script:

```
npm start
```

In the Module Federation terminology, `widget` plugin is called `remote` and the `cokpit` is called `shell`. Modules provided by this `widget` will be loaded by the `cockpit` application at the runtime. This plugin provides a basic custom widget that can be accessed through the `Add widget` menu.

> Note that the `--shell` flag creates a proxy to the cockpit application and provides` AdvancedMapWidgetModule` as an `remote` via URL options.

Also deploying needs no special handling and can be simply done via `npm run deploy`. As soon as the application has exports it will be uploaded as a plugin.

---

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

---

For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).
