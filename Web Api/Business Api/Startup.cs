using Business_Api.Middleware;
using DBLayer;
using DBLayer.Repo.Implementation;
using DBLayer.Repo.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Models;
using Services.Implementation;
using Services.Interfaces;
using System;

namespace Business_Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.Configure<EncryptionSettings>(Configuration.GetSection("MySettings"));
            services.ConfigureWritable<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
            services.AddSingleton<IEncryption, Encryption>();
            //services.AddAuthentication("BasicAuthentication")
            //    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

            services.AddScoped<EmployeeDBContext>();
            services.AddTransient<IEmployeeRepo, EmployeeRepo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,
            IHostApplicationLifetime applicationLifetime,
            IWritableOptions<ConnectionStrings> options)
        {
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}

            applicationLifetime.ApplicationStarted.Register(() =>
            {
                EncryptConfig(app.ApplicationServices, options);
            });

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto
            });

            app.UseMiddleware<ExceptionMiddleware>();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }

        private void EncryptConfig(IServiceProvider services, IWritableOptions<ConnectionStrings> options)
        {
            var encryption = services.GetRequiredService<IEncryption>();
            try
            {
                encryption.Decrypt(Convert.FromBase64String(options.Value.EmployeeDBConnection));
            }
            catch
            {
                //options.Value.EmployeeDBConnection = Convert.ToBase64String(encryption.Encrypt(options.Value.EmployeeDBConnection));
                options.Update(opt =>
                {
                    opt.EmployeeDBConnection = Convert.ToBase64String(encryption.Encrypt(options.Value.EmployeeDBConnection));
                });
            }
        }
    }

}
