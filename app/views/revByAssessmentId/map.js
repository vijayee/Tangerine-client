// Generated by CoffeeScript 1.7.1
(function(doc) {
  var id;
  if (doc.collection === "result") {
    return;
  }
  id = doc.assessmentId || doc.curriculumId;
  if (id == null) {
    return;
  }
  return emit(id, {
    "_id": doc._id,
    "_rev": doc._rev
  });
});
