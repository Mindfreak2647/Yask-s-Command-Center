api.controller = function($interval, spModal) {

    var c = this;

    c.executiveMode = false;

    c.priorityFilter = {};


    c.toggleExecutiveView = function() {

        c.executiveMode = !c.executiveMode;

    };

    c.filterPriority = function(priority) {

        c.priorityFilter = {
            priority: priority
        };

    };


    c.clearFilter = function() {

        c.priorityFilter = {};

    };


    function updateClock() {

        var now = new Date();

        c.currentTime = now.toLocaleTimeString();

    }

    updateClock();

    $interval(updateClock, 1000);

    $interval(function() {

        c.server.refresh();

    }, 20000);


    c.openIncident = function(inc) {

        spModal.open({

            title: 'Incident Details - ' + inc.number,

            message:

                '<div class=\"popup-content\">' +

                '<p><strong>Short Description:</strong> ' +
                inc.short_description + '</p>' +

                '<p><strong>Priority:</strong> ' +
                inc.priority + '</p>' +

                '<p><strong>State:</strong> ' +
                inc.state + '</p>' +

                '<p><strong>Assigned To:</strong> ' +
                inc.assigned_to + '</p>' +

                '<p><strong>Assignment Group:</strong> ' +
                inc.assignment_group + '</p>' +

                '<p><strong>Category:</strong> ' +
                inc.category + '</p>' +

                '<p><strong>Business Service:</strong> ' +
                inc.business_service + '</p>' +

                '<p><strong>Configuration Item:</strong> ' +
                inc.cmdb_ci + '</p>' +

                '<p><strong>Caller:</strong> ' +
                inc.caller + '</p>' +

                '<p><strong>Description:</strong><br>' +
                (inc.description || 'No Description') +
                '</p>' +

                '</div>',

            buttons: [
                {
                    label: 'Close',
                    cancel: true
                }
            ]

        });

    };

    c.showExecutiveDetails = function(type) {

        var content = '';


        if(type === 'services') {

            content =
                '<ul>' +
                '<li>Payment Gateway Service</li>' +
                '<li>Customer Login API</li>' +
                '<li>Core Banking Database</li>' +
                '</ul>';

        }

        else if(type === 'revenue') {

            content =
                '<ul>' +
                '<li>Online transactions impacted</li>' +
                '<li>Estimated revenue exposure: $120K/hour</li>' +
                '<li>Checkout failures increasing</li>' +
                '</ul>';

        }

        else if(type === 'sla') {

            content =
                '<ul>' +
                '<li>' + c.data.p1Count +
                ' Priority 1 incidents near SLA breach</li>' +

                '<li>Database latency exceeding threshold</li>' +

                '<li>Escalation triggered to operations team</li>' +
                '</ul>';

        }


        else if(type === 'regions') {

            content =
                '<ul>' +
                '<li>APAC region experiencing latency</li>' +
                '<li>EU users reporting login failures</li>' +
                '<li>North America stable</li>' +
                '</ul>';

        }


        spModal.open({

            title: 'Executive Impact Analysis',

            message:
                '<div class=\"popup-content\">' +
                content +
                '</div>',

            buttons: [
                {
                    label: 'Close',
                    cancel: true
                }
            ]

        });

    };

};
