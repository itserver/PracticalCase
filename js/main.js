var userpassword=username+":"+password;

function inicializarElementos(){
	
	/**************************************************    SEARCHING IN ALL SNOMED CT   ***************************************************************************************/

	$("#busquedaEnTodoSNOMED").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/en/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.term
							};
						}));
					}
				});
		}
	});


	/**************************************************    SEARCHING IN ALL SNOMED CT BY CONTEXT - SUSTANCE   ************************************************************/
	$("#busquedaEnTodoSNOMEDConContexto").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/en/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110?context=105590001",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.term
							};
						}));
					}
				});
		}
	});


	/**************************************************    SEARCHING IN A LOCAL TERMINOLOGY   ************************************************************************************/
	$("#busquedaEnTerminologiaLocal").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/catalogs/searchItemsInCatalog/catalog/terminologia_ejemplo/termToSearch/" + request.term + "/numberOfElements/110?",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.description
							};
						}));
					}
				});
		}
	});
	

	/**************************************************    SEARCHING IN A SUBSET   *****************************************************************************************/
	$("#busquedaEnSubconjunto").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/subsets/searchItemsInSubset/subset/pruebaMSSSI/termToSearch/" + request.term + "?numberOfElements=100&language=en",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.definition
							};
						}));
					}
				});
		}
	});


	/**************************************************    SEARCHING IN MAPSETS   ***************************************************************************************************/
	$("#busquedaDeMapeos").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/en/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								conceptid: item.conceptid,
								value: item.term
							};
						}));
					}
					
					
				});
		},
		select: function( event, ui ) {
			var conceptid = ui.item.conceptid;
			
			fillMappingInformation(conceptid); 						
			
			$("#busquedaDeMapeos").val(ui.item.value);
			$("#busquedaDeMapeos").attr("value", ui.item.value);
			$("#busquedaDeMapeos").html(ui.item.value);
			
			return false;
		},
	});

	function fillMappingInformation(conceptIdToMap){

		$.ajax({
			url: "http://www.itserver.es/ITServer/rest/mapset/lang/en/getTerminologyMapping/sourceTerminologyName/SNOMED CT?targetTerminologies=ICD-9-CM|ICD-10&codes=" + conceptIdToMap,
			dataType: "json",
			beforeSend: function(req) {
				req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
			},
			success: function( data) {
				setMappingInfo(data, conceptIdToMap);
				return false;
			}

		});

	}

	function setMappingInfo(data, conceptIdToMap){
		
		if(data.length == 0){
			alert("No mapset found for selected SNOMED CT term");
		}else{

			var cie9mappings = "";
			var cie10mappings = "";

			for (var i=0;i<data.length;i++){
				var ciemap=data[i];
				if(ciemap.targetTerminologyName == "CIE-9-MC"){
					cie9mappings = cie9mappings + ciemap.mapsetTargetTerminologyItem.codTerminologyItem + "; " ;
				}else{
					cie10mappings = cie10mappings + ciemap.mapsetTargetTerminologyItem.codTerminologyItem + "; ";
				}
			}

			cie9mappings = cie9mappings.substring(0, cie9mappings.length - 2);
			cie10mappings = cie10mappings.substring(0, cie10mappings.length - 2);

			$("#cie9map").attr("value", cie9mappings);
			$("#cie10map").attr("value", cie10mappings);

		}
	}


}
