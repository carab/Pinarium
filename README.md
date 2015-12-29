Vinarium
========

## What is Vinarium

Vinarium is used and developped by people in love with wines.
It allows to manage wine caves, to better know what you have, what to drink, and when to drink.

## Features

Frontend :

* Add a set of bottles by setting various properties.
* List your bottles.
* Manage your quantities and your "dranked" quantities.
* Modify or delete bottles.
* Mobile friendly interface.

Backend :

* Based on Firebase solution for database and hosting.

## Planned Features

Frontend :

* Add translations.
* Add multi-cave system.
* Add settings page.
* Improve bottle form, add autocomplete, add photo.
* Fast button to set a bottle as "dranked" and add "dranked" date.
* Add search filters.
* Automatically fetch bottle data from a photo.
* Fetch data to know when it is better do drink a bottle.

Backend :

* More secured Firebase rules.
* Develop unit and e2e tests.

## Known bugs

* Modifying a bottle without submitting still modify the bottle until next page reload.

## How to contribute

### By posting issues or requests

We are open to any kind of suggestions, please let us know !

### By developing

Install Node and NPM.

Install Bower and Gulp :

```
npm install --global gulp bower
```

Install dependencies :

```
npm install
bower install
```

Run local server which includes BrowserSync :

```
gulp serve
```

The local code is bound to the vinarium-dev Firebase database.

Build development in dist :

```
gulp build:development
```

The development code is bound to the vinarium-dev Firebase database.

Build production in dist :

```
gulp
```

The production code is bound to the vinarium Firebase database.

To deploy to the development environment (vinarium-dev) :

```
gulp deploy:development
```

To deploy to the production environment (vinarium) :

```
gulp deploy:production
```
