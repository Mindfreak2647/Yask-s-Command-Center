(function() {

    data.p1Count = 0;
    data.p2Count = 0;
    data.totalIncidents = 0;
    data.incidents = [];

    var gr = new GlideRecord('incident');

    gr.addActiveQuery();

    gr.orderByDesc('sys_created_on');

    gr.query();

    while(gr.next()) {

        data.totalIncidents++;

        if(gr.priority == 1)
            data.p1Count++;

        if(gr.priority == 2)
            data.p2Count++;

        data.incidents.push({

            sys_id: gr.getUniqueValue(),

            number: gr.number.toString(),

            short_description:
                gr.short_description.toString(),

            priority:
                gr.priority.toString(),

            state:
                gr.state.getDisplayValue(),

            assigned_to:
                gr.assigned_to.getDisplayValue(),

            opened:
                gr.sys_created_on.getDisplayValue(),

            description:
                gr.description.toString(),

            category:
                gr.category.getDisplayValue(),

            assignment_group:
                gr.assignment_group.getDisplayValue(),

            caller:
                gr.caller_id.getDisplayValue(),

            business_service:
                gr.business_service.getDisplayValue(),

            cmdb_ci:
                gr.cmdb_ci.getDisplayValue(),

            risk:
                gr.priority == 1
                ? 'High Risk'
                : 'Normal'

        });

    }

})();
