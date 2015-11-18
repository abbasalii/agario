MAP = new function()
{
	var gameW;
	var gameH;
	var mapW;
	var mapH;
	var ctx;
	var radius = 5;

	this.init = function(w,h)
	{
		mapW = $("#myCanvas").width();
		mapH = $("#myCanvas").height();
		gameW = w;
		gameH = h;

		var c = document.getElementById("myCanvas");
		ctx = c.getContext("2d");
	}

	this.drawPoint = function(x,y)
	{
		ctx.clearRect(0,0,mapW,mapH);
		ctx.beginPath();
		ctx.arc((x*mapW)/gameW,(y*mapH)/gameH,radius,0,2*Math.PI);
		ctx.fill();
	}

	this.setRadius = function(r)
	{
		radius = r;
	}

	this.loginWithFB = function(data){

		$.ajax({
			url: "fblogin",
			type: "post",
			data : { "fbid": data.id, "firstname": data.first_name, "lastname": data.last_name},
			success: function(response){

				switch(response.code)
				{
					case 200:
					alert("successfull");
					break;

					case 210:
					alert("new user added");
					break;

					case 500:
					alert("Could not connect to the database");
					break;

					default:
					alert("failed");
				}
			}
		});
	}
}

$(function() {

	// MAP.init(1000,500);
	// MAP.drawPoint(1000,500);

	$("#signup-form").submit(function(){

		$.ajax({
			url: $('#signup-form').attr('action'),
			type: $('#signup-form').attr('method'),
			data : $('#signup-form').serialize(),
			success: function(response){

				switch(response.code)
				{
					case 200:
					alert("successfull");
					break;

					case 500:
					alert("Could not connect to the database");
					break;

					case 501:
					alert("Failed to get existing users");
					break;

					case 502:
					alert("Username already exists");
					break;

					default:
					alert("failed");
				}
			}
		});
		return false;
	});

	$("#signin-form").submit(function(){

		$.ajax({
			url: $('#signin-form').attr('action'),
			type: $('#signin-form').attr('method'),
			data : $('#signin-form').serialize(),
			success: function(response){

				switch(response.code)
				{
					case 200:
					alert("successfull");
					break;

					case 500:
					alert("Could not connect to the database");
					break;

					case 505:
					alert("Invalid username or password");
					break;

					default:
					alert("failed");
				}
			}
		});
		return false;
	});

});