import { useEffect, useRef } from "react";

export default function StartGame({ grid, setGrid, setGameStarted }) {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;

    modalInstanceRef.current = new window.bootstrap.Modal(modalEl, {
      backdrop: true,
      keyboard: true,
    });

    modalInstanceRef.current.show();

    const handleHidden = () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((el) => el.remove());
      document.body.style.overflow = "auto";
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      modalInstanceRef.current?.hide();
    };
  }, []);

  const handleStart = () => {
    modalInstanceRef.current?.hide();
    setGameStarted(true);

    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((el) => el.remove());
    document.body.style.overflow = "auto";
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header text-success text-center">
            <h5 className="modal-title" id="exampleModalLabel">
              Welcome
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body text-center">
            <DropDown grid={grid} setGrid={setGrid} />
            Click start to begin the game!
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropDown({ grid, setGrid }) {
  const handleSelect = (value) => {
    setGrid(value);
    console.log("Grid set to:", value);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle m-3"
        type="button"
        id="gridDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Select Grid: {grid}x{grid}
      </button>
      <ul className="dropdown-menu" aria-labelledby="gridDropdown">
        <li>
          <button className="dropdown-item" onClick={() => handleSelect(3)}>
            3x3
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleSelect(4)}>
            4x4
          </button>
        </li>
      </ul>
    </div>
  );
}
