import { NestContainer } from '@nestjs/core';
import { SWAGGER_CONSTANTS } from './constants';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { env } from '~config/env.config';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

declare let window;

export class EnvironmentSwagger {
    private document: OpenAPIObject;

    constructor(private app) {}

    buildDocuments() {
        this.buildPublicDocuments();
        if (env.APP_ENV !== 'production') {
            this.buildPrivateDocuments();
        }
    }

    buildPublicDocuments() {
        const config = new DocumentBuilder()
            .setTitle('Document for youtube videos sharing app')
            .setDescription('The youtube videos sharing app API description')
            .setVersion('1.0')
            .build();
        let publicDocument = SwaggerModule.createDocument(this.app, config);
        this.filterPublicDocuments(publicDocument);
        publicDocument.components.schemas = this.getPublicSchema(publicDocument);
        SwaggerModule.setup('docs', this.app, publicDocument);
    }

    private getPublicSchema(publicDocument: OpenAPIObject) {
        let schemas = {};
        for (let key of Object.keys(publicDocument.components.schemas)) {
            if (this.checkDocumentUseSchema(publicDocument, key)) {
                schemas[key] = publicDocument.components.schemas[key];
            }
        }
        return schemas;
    }

    private checkDocumentUseSchema(publicDocument: OpenAPIObject, schemaName: string) {
        let routers = this.getDocumentRouters(publicDocument);
        for (let router of routers) {
            for (let contentType in router.action?.requestBody?.content) {
                let ref = router.action.requestBody.content[contentType]?.schema?.$ref;
                if (ref && ref.endsWith(`/${schemaName}`)) {
                    return true;
                }
            }
        }

        return false;
    }

    private filterPublicDocuments(publicDocument: OpenAPIObject) {
        let paths = {};
        let properties = this.getRouterProperty();
        for (let property of properties) {
            let isPublicAPI = Reflect.getMetadata(
                SWAGGER_CONSTANTS.PUBLIC_API,
                property.router.metatype.prototype[property.name]
            );
            if (isPublicAPI) {
                let routers = this.getDocumentRouters(publicDocument);
                for (let router of routers) {
                    if (router.action.operationId === `${property.router.metatype.name}_${property.name}`) {
                        if (!paths.hasOwnProperty(router.path)) {
                            paths[router.path] = {};
                        }
                        paths[router.path][router.method] = publicDocument.paths[router.path][router.method];
                    }
                }
            }
        }
        publicDocument.paths = paths;
    }

    buildPrivateDocuments() {
        const config = new DocumentBuilder()
            .setTitle('Document for youtube videos sharing app')
            .setDescription('The youtube videos sharing app API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        this.document = SwaggerModule.createDocument(this.app, config);
        this.addHelper();
        SwaggerModule.setup('documents', this.app, this.document, {
            customJs: '../swagger-helper.js',
            swaggerOptions: {
                requestInterceptor: (request) => {
                    request.responseInterceptor = (response) => {
                        window.handleRequest(request, response);
                    };
                    return request;
                }
            }
        });
    }

    private getRouterProperty(): { name: string; router: InstanceWrapper }[] {
        const container: NestContainer = this.app.container;
        let modules = container.getModules();
        let properties = [];
        for (let module of modules.values()) {
            for (let router of module.routes.values()) {
                for (let property of Object.getOwnPropertyNames(router.metatype.prototype)) {
                    properties.push({
                        name: property,
                        router
                    });
                }
            }
        }

        return properties;
    }

    addHelper() {
        let properties = this.getRouterProperty();
        for (let property of properties) {
            let actionSetValue = Reflect.getMetadata(
                SWAGGER_CONSTANTS.SET_VALUE,
                property.router.metatype.prototype[property.name]
            );
            if (actionSetValue) {
                this.addCustomValueToDocument(actionSetValue, `${property.router.metatype.name}_${property.name}`);
            }
        }
    }

    private getDocumentRouters(document: OpenAPIObject) {
        let routers = [];
        for (let path in document.paths) {
            for (let method in document.paths[path]) {
                routers.push({
                    path: path,
                    method: method,
                    action: document.paths[path][method]
                });
            }
        }
        return routers;
    }

    private addCustomValueToDocument(actionSetValue, operationId) {
        let routers = this.getDocumentRouters(this.document);
        for (let path of routers) {
            if (path.action.operationId === operationId) {
                if (!path.action.actionSetValue) {
                    path.action.actionSetValue = [];
                }
                path.action.actionSetValue.push(actionSetValue);
            }
        }
    }
}
