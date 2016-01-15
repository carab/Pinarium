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
* Modify or delete caves.
* Mobile friendly interface.

Backend :

* Based on Firebase solution for database and hosting.

## Planned Features

Frontend :

* Improve bottle form : add medals data, add degustations, add plates, add photo.
* Fast button to set a bottle as "dranked" and add "dranked" date.
* Add search filters.
* Automatically fetch bottle data from a photo.
* Fetch data to know when it is better do drink a bottle.
* Import/Export feature.
* Reminder to drink feature + auto reminder with progress bar.
* Mass edit actions : move cave, edit property.
* Map of the references to ease locating a bottle in the physical cave.
* Stars for ranking.

Backend :

* Develop unit and e2e tests.
* Document language add.
* Use gulp-htmlmin and gulp-cssnano instead.

## Known bugs

* Add and Edit popins create a blank window behind them.

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
