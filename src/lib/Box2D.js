import { Box2D } from './box2dBase.js';

const B2Vec2 = Box2D.Common.Math.b2Vec2;
const B2BodyDef = Box2D.Dynamics.b2BodyDef;
const B2Body = Box2D.Dynamics.b2Body;
const B2FixtureDef = Box2D.Dynamics.b2FixtureDef;
const B2Fixture = Box2D.Dynamics.b2Fixture;
const B2World = Box2D.Dynamics.b2World;
const B2MassData = Box2D.Collision.Shapes.b2MassData;
const B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const B2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
const B2DebugDraw = Box2D.Dynamics.b2DebugDraw;
const B2ContactListener = Box2D.Dynamics.b2ContactListener;

export {
  B2Vec2,
  B2BodyDef,
  B2Body,
  B2FixtureDef,
  B2Fixture,
  B2World,
  B2MassData,
  B2PolygonShape,
  B2CircleShape,
  B2DebugDraw,
  B2ContactListener
};
