api.controller = function($interval, spModal) {

    var c = this;

    c.executiveMode = false;

    c.priorityFilter = {};

    c.currentTime = "";

   

    c.criticalServicesCount = 0;

    c.regionalImpactCount = 0;


    c.buildExecutiveMetrics = function() {

        var services = {};

        var regions = {};

        c.data.incidents.forEach(function(inc) {


            if(inc.priority == '1' &&
               inc.business_service) {

                services[inc.business_service] = true;

            }

            if(inc.location) {

                regions[inc.location] = true;

            }

        });

        c.criticalServicesCount =
            Object.keys(services).length;

        c.regionalImpactCount =
            Object.keys(regions).length;

    };


    c.buildExecutiveMetrics();


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

        c.currentTime =
            now.toLocaleTimeString();

    }

    updateClock();

    var clockInterval =
        $interval(updateClock, 1000);


    var refreshInterval = $interval(function() {

        c.server.refresh().then(function() {

            c.buildExecutiveMetrics();

        });

    }, 20000);

    c.$onDestroy = function() {

        $interval.cancel(clockInterval);

        $interval.cancel(refreshInterval);

    };
    c.openIncident = function(inc) {

        spModal.open({

            title:
                'Incident Details - ' +
                inc.number,

            message:

                '<div class="popup-content">' +

                '<p><strong>Short Description:</strong> ' +
                inc.short_description +
                '</p>' +

                '<p><strong>Priority:</strong> ' +
                inc.priority +
                '</p>' +

                '<p><strong>State:</strong> ' +
                inc.state +
                '</p>' +

                '<p><strong>Assigned To:</strong> ' +
                inc.assigned_to +
                '</p>' +

                '<p><strong>Assignment Group:</strong> ' +
                inc.assignment_group +
                '</p>' +

                '<p><strong>Category:</strong> ' +
                inc.category +
                '</p>' +

                '<p><strong>Business Service:</strong> ' +
                inc.business_service +
                '</p>' +

                '<p><strong>Configuration Item:</strong> ' +
                inc.cmdb_ci +
                '</p>' +

                '<p><strong>Location:</strong> ' +
                (inc.location || 'N/A') +
                '</p>' +

                '<p><strong>Caller:</strong> ' +
                inc.caller +
                '</p>' +

                '<p><strong>Description:</strong><br>' +
                (inc.description ||
                 'No Description') +
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

            var services = {};

            c.data.incidents.forEach(function(inc) {

                if(inc.priority == '1' &&
                   inc.business_service) {

                    services[
                        inc.business_service
                    ] = true;

                }

            });

            content = '<ul>';

            Object.keys(services)
                .forEach(function(service) {

                content +=
                    '<li>' +
                    service +
                    '</li>';

            });

            if(Object.keys(services)
               .length === 0) {

                content +=
                    '<li>No critical services impacted</li>';

            }

            content += '</ul>';

        }

        else if(type === 'sla') {

            content = '<ul>';

            c.data.incidents.forEach(function(inc) {

                if(inc.priority == '1') {

                    content +=
                        '<li>' +
                        inc.number +
                        ' - ' +
                        inc.short_description +
                        '</li>';

                }

            });

            if(c.data.p1Count === 0) {

                content +=
                    '<li>No active SLA exposure</li>';

            }

            content += '</ul>';

        }

        else if(type === 'regions') {

            var regions = {};

            c.data.incidents.forEach(function(inc) {

                if(inc.location) {

                    regions[
                        inc.location
                    ] = true;

                }

            });

            content = '<ul>';

            Object.keys(regions)
                .forEach(function(region) {

                content +=
                    '<li>' +
                    region +
                    '</li>';

            });

            if(Object.keys(regions)
               .length === 0) {

                content +=
                    '<li>No regional impact detected</li>';

            }

            content += '</ul>';

        }

        else if(type === 'revenue') {

            content =
                '<ul>' +

                '<li>Active P1 Incidents: ' +
                c.data.p1Count +
                '</li>' +

                '<li>Total Active Incidents: ' +
                c.data.totalIncidents +
                '</li>' +

                '<li>Potential business disruption detected</li>' +

                '</ul>';

        }
        spModal.open({

            title:
                'Executive Impact Analysis',

            message:
                '<div class="popup-content">' +
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
